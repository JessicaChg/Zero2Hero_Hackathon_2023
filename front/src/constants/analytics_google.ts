//谷歌数据埋点配置列表
export const GA_EventIdList: any = {
    "Rel_SOUL_Nav_Plan": ["Rel_SOUL_Nav_Plan", "ClickLaunchPlan"],
}

//谷歌数据分析触发
export const GAEvent = (eventId: string, desc?: string) => {
    try {
        var params = GA_EventIdList[eventId] || null;
        if (params) {
            // @ts-ignore
            gtag('event', params[0], 
                {
                    'Event_ID': params[0],
                    'Event_Name': params[1],
                    'Event_Desc': desc || '-',
                    'Event_Platform': 'RaltionNameServiceSoul'
                }
            );
        }
    } catch (e) {}
}