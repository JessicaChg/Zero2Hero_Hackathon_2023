pragma solidity ^0.8.0;

pragma solidity ^0.8.0;

import "@bnb-chain/greenfield-contracts-sdk/BucketApp.sol";
import "@bnb-chain/greenfield-contracts-sdk/ObjectApp.sol";
import "@bnb-chain/greenfield-contracts-sdk/GroupApp.sol";
import "@bnb-chain/greenfield-contracts-sdk/interface/IERC1155.sol";
import "@bnb-chain/greenfield-contracts-sdk/interface/IERC721Nontransferable.sol";
import "@bnb-chain/greenfield-contracts-sdk/interface/IERC1155Nontransferable.sol";

contract RelationStorage is BucketApp, ObjectApp, GroupApp {
    
    string public constant ERROR_INVALID_NAME = "1";
    string public constant ERROR_RESOURCE_EXISTED = "2";
    string public constant ERROR_GROUP_NOT_EXISTED = "3";
    string public constant ERROR_FILE_NOT_ONSHELF = "4";
    string public constant ERROR_NOT_ENOUGH_VALUE = "5";

    /*----------------- storage -----------------*/
    // admins
    address public owner;
    mapping(address => bool) public operators;

    // ERC1155 token 
    address public erc1155Token;

    // system contract
    address public bucketToken;
    address public objectToken;
    address public groupToken;
    address public memberToken;

    // tokenId => series name
    mapping(uint256 => string) public seriesName;
    // series name => tokenId
    mapping(string => uint256) public seriesId;

    // tokenId => file name
    mapping(uint256 => string) public fileName;
    // file name => tokenId
    mapping(string => uint256) public fileId;
    // file id => group id
    mapping(uint256 => uint256) public fileGroup;

    // tokenId => group name
    mapping(uint256 => string) public groupName;
    // group name => tokenId
    mapping(string => uint256) public groupId;
    // group id => file id
    mapping(uint256 => uint256) public groupFile;



    // PlaceHolder reserve for future use
    uint256[25] public RelationStorageSlots;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == owner || _isOperator(msg.sender), "caller is not the owner or operator");
        _;
    }

    function initialize(
        address _crossChain,
        address _bucketHub,
        address _objectHub,
        address _groupHub,
        address _paymentAddress,
        uint256 _callbackGasLimit,
        address _refundAddress,
        uint8 _failureHandleStrategy,
        address _owner,
        address _erc1155Token
    ) public initializer {
        require(_owner != address(0), string.concat("RelationStorage: ", ERROR_INVALID_CALLER));
        _transferOwnership(_owner);

        erc1155Token = _erc1155Token;
        bucketToken = IBucketHub(_bucketHub).ERC721Token();
        objectToken = IObjectHub(_objectHub).ERC721Token();
        groupToken = IGroupHub(_groupHub).ERC721Token();
        memberToken = IGroupHub(_groupHub).ERC1155Token();

        __base_app_init_unchained(_crossChain, _callbackGasLimit, _refundAddress, _failureHandleStrategy);
        __bucket_app_init_unchained(_bucketHub, _paymentAddress);
        __group_app_init_unchained(_groupHub);
        __object_app_init_unchained(_objectHub);
    }

    /*----------------- external functions -----------------*/
    function greenfieldCall(
        uint32 status,
        uint8 resoureceType,
        uint8 operationType,
        uint256 resourceId,
        bytes calldata callbackData
    ) external override(BucketApp, ObjectApp, GroupApp) {
        require(msg.sender == crossChain, string.concat("RelationStorage: ", ERROR_INVALID_CALLER));

        if (resoureceType == RESOURCE_BUCKET) {
            _bucketGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resoureceType == RESOURCE_OBJECT) {
            _objectGreenfieldCall(status, operationType, resourceId, callbackData);
        } else if (resoureceType == RESOURCE_GROUP) {
            _groupGreenfieldCall(status, operationType, resourceId, callbackData);
        } else {
            revert(string.concat("RelationStorage: ", ERROR_INVALID_RESOURCE));
        }
    }

    /**
     * @dev Create a new series.
     *
     * Assuming the sp provider's info will be provided by the front-end.
     */
    function createSeries(
        string calldata name,
        BucketStorage.BucketVisibilityType visibility,
        uint64 chargedReadQuota,
        address spAddress,
        uint256 expireHeight,
        bytes calldata sig
    ) external payable {
        require(bytes(name).length > 0, string.concat("RelationStorage: ", ERROR_INVALID_NAME));
        require(seriesId[name] == 0, string.concat("RelationStorage: ", ERROR_RESOURCE_EXISTED));

        bytes memory _callbackData = bytes(name); // use name as callback data
        _createBucket(msg.sender, name, visibility, chargedReadQuota, spAddress, expireHeight, sig, _callbackData);
    }

    function createGroup(uint256 _fileId) public payable {
        require(
            IERC721NonTransferable(objectToken).ownerOf(_fileId) == msg.sender,
            string.concat("RelationStorage: ", ERROR_INVALID_CALLER)
        );

        string memory name = string.concat("Group for ", fileName[_fileId]);
        require(groupId[name] == 0, string.concat("RelationStorage: ", ERROR_RESOURCE_EXISTED));

        bytes memory _callbackData = bytes(name); // use name as callback data
        _createGroup(msg.sender, name, _callbackData);
    }

    function publishFile(uint256 _fileId) external {
        require(
            IERC721NonTransferable(objectToken).ownerOf(_fileId) == msg.sender,
            string.concat("RelationStorage: ", ERROR_INVALID_CALLER)
        );
        require(fileGroup[_fileId] != 0, string.concat("RelationStorage: ", ERROR_GROUP_NOT_EXISTED));

        IERC1155(erc1155Token).mint(msg.sender, _fileId, 1, "");
    }

    function shareFile(uint256 _fileId,address to) external {

        IERC1155(erc1155Token).mint(to, _fileId, 1, "");

        uint256 _groupId = fileGroup[_fileId];
        address _owner = IERC721NonTransferable(groupToken).ownerOf(_groupId);
        address[] memory _member = new address[](1);
        _member[0] = to;
        _updateGroup(_owner, _groupId, UPDATE_ADD, _member);

    }

    /**
     * @dev Register bucket resource that mirrored from GreenField to BSC.
     */
    function registerSeries(string calldata name, uint256 tokenId) external {
        require(
            IERC721NonTransferable(bucketToken).ownerOf(tokenId) == msg.sender,
            string.concat("RelationStorage: ", ERROR_INVALID_CALLER)
        );
        require(bytes(name).length > 0, string.concat("RelationStorage: ", ERROR_INVALID_NAME));
        require(seriesId[name] == 0, string.concat("RelationStorage: ", ERROR_RESOURCE_EXISTED));

        seriesName[tokenId] = name;
        seriesId[name] = tokenId;
    }

    /**
     * @dev Register object resource that mirrored from GreenField to BSC.
     */
    function registerFile(
        string calldata _fileName,
        uint256 _fileId,
        string calldata _groupName,
        uint256 _groupId
    ) external {
        require(
            IERC721NonTransferable(objectToken).ownerOf(_fileId) == msg.sender,
            string.concat("RelationStorage: ", ERROR_INVALID_CALLER)
        );
        require(bytes(_fileName).length > 0, string.concat("RelationStorage: ", ERROR_INVALID_NAME));
        require(fileId[_fileName] == 0, string.concat("RelationStorage: ", ERROR_RESOURCE_EXISTED));

        fileName[_fileId] = _fileName;
        fileId[_fileName] = _fileId;

        if (_groupId != 0) {
            require(
                IERC721NonTransferable(groupToken).ownerOf(_groupId) == msg.sender,
                string.concat("RelationStorage: ", ERROR_INVALID_CALLER)
            );
            require(bytes(_groupName).length > 0, string.concat("RelationStorage: ", ERROR_INVALID_NAME));

            groupName[_groupId] = _groupName;
            groupId[_groupName] = _groupId;

            groupFile[_groupId] = _fileId;
            fileGroup[_fileId] = _groupId;
        }
    }

    /**
     * @dev Register group resource that mirrored from GreenField to BSC.
     */
    function registerGroup(string calldata name, uint256 tokenId) external {
        require(
            IERC721NonTransferable(groupToken).ownerOf(tokenId) == msg.sender,
            string.concat("RelationStorage: ", ERROR_INVALID_CALLER)
        );
        require(bytes(name).length > 0, string.concat("RelationStorage: ", ERROR_INVALID_NAME));
        require(groupId[name] == 0, string.concat("RelationStorage: ", ERROR_RESOURCE_EXISTED));

        groupName[tokenId] = name;
        groupId[name] = tokenId;
    }

    /*----------------- admin functions -----------------*/
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), string.concat("RelationStorage: ", ERROR_INVALID_CALLER));
        _transferOwnership(newOwner);
    }

    function addOperator(address newOperator) public onlyOwner {
        operators[newOperator] = true;
    }

    function removeOperator(address operator) public onlyOwner {
        delete operators[operator];
    }

    function retryPackage(uint8 resoureceType) external override onlyOperator {
        if (resoureceType == RESOURCE_BUCKET) {
            _retryBucketPackage();
        } else if (resoureceType == RESOURCE_OBJECT) {
            _retryObjectPackage();
        } else if (resoureceType == RESOURCE_GROUP) {
            _retryGroupPackage();
        } else {
            revert(string.concat("RelationStorage: ", ERROR_INVALID_RESOURCE));
        }
    }

    function skipPackage(uint8 resoureceType) external override onlyOperator {
        if (resoureceType == RESOURCE_BUCKET) {
            _skipBucketPackage();
        } else if (resoureceType == RESOURCE_OBJECT) {
            _skipObjectPackage();
        } else if (resoureceType == RESOURCE_GROUP) {
            _skipGroupPackage();
        } else {
            revert(string.concat("RelationStorage: ", ERROR_INVALID_RESOURCE));
        }
    }


    /*----------------- internal functions -----------------*/
    function _transferOwnership(address newOwner) internal {
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function _isOperator(address account) internal view returns (bool) {
        return operators[account];
    }
}