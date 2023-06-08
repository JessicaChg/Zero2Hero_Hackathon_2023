import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Root } from '../pages/root.tsx'
import { Friends } from '../pages/friends.tsx'
import { FriendAddress } from '../pages/friend/[address].tsx'
import { MyDAO } from '../pages/myDao.tsx'
import { Followers } from '../pages/followers.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/following',
    element: <Friends />,
  },
  {
    path: '/followers',
    element: <Followers />,
  },
  {
    path: '/friend/:address',
    element: <FriendAddress />,
  },
  {
    path: '/dao/:address',
    element: <MyDAO />,
  },
])

export const Route = () => {
  return <RouterProvider router={router}></RouterProvider>
}
