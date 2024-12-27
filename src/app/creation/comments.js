export const Comments = [
    { id: 1, root: 0, parent: 0, dialog: 0, content: "我是评论id为1的信息", time: "2023-04-20 16:14", name: "张三" },
    { id: 2, root: 0, parent: 0, dialog: 0, content: "我是评论id为2的信息", time: "2023-04-20 16:20", name: "李四" },
    { id: 3, root: 0, parent: 0, dialog: 0, content: "我是评论id为3的信息", time: "2023-04-20 16:30", name: "王五" },
  
    // 一级评论下的二级评论
    { id: 4, root: 1, parent: 1, dialog: 4, content: "我是评论id为4的信息，回复评论id为1", time: "2023-04-20 16:35", name: "赵六" },
    { id: 5, root: 1, parent: 1, dialog: 4, content: "我是评论id为5的信息，回复评论id为1", time: "2023-04-20 16:40", name: "周七" },
  
    { id: 6, root: 2, parent: 2, dialog: 6, content: "我是评论id为6的信息，回复评论id为2", time: "2023-04-20 16:45", name: "吴八" },
    { id: 7, root: 2, parent: 2, dialog: 6, content: "我是评论id为7的信息，回复评论id为2", time: "2023-04-20 16:50", name: "郑九" },
  
    { id: 8, root: 3, parent: 3, dialog: 8, content: "我是评论id为8的信息，回复评论id为3", time: "2023-04-20 16:55", name: "冯十" },
    { id: 9, root: 3, parent: 3, dialog: 8, content: "我是评论id为9的信息，回复评论id为3", time: "2023-04-20 17:00", name: "陈十一" },
  
    // 二级评论下的三级评论
    { id: 10, root: 1, parent: 4, dialog: 4, content: "我是评论id为10的信息，回复评论id为4", time: "2023-04-20 17:05", name: "孙十二" },
    { id: 11, root: 1, parent: 4, dialog: 4, content: "我是评论id为11的信息，回复评论id为4", time: "2023-04-20 17:10", name: "李十三" },
  
    { id: 12, root: 1, parent: 5, dialog: 5, content: "我是评论id为12的信息，回复评论id为5", time: "2023-04-20 17:15", name: "黄十四" },
    { id: 13, root: 1, parent: 5, dialog: 5, content: "我是评论id为13的信息，回复评论id为5", time: "2023-04-20 17:20", name: "刘十五" },
  
    { id: 14, root: 2, parent: 6, dialog: 6, content: "我是评论id为14的信息，回复评论id为6", time: "2023-04-20 17:25", name: "赵十六" },
    { id: 15, root: 2, parent: 6, dialog: 6, content: "我是评论id为15的信息，回复评论id为6", time: "2023-04-20 17:30", name: "钱十七" },
  
    { id: 16, root: 2, parent: 7, dialog: 7, content: "我是评论id为16的信息，回复评论id为7", time: "2023-04-20 17:35", name: "孙十八" },
    { id: 17, root: 2, parent: 7, dialog: 7, content: "我是评论id为17的信息，回复评论id为7", time: "2023-04-20 17:40", name: "周十九" },
  
    { id: 18, root: 3, parent: 8, dialog: 8, content: "我是评论id为18的信息，回复评论id为8", time: "2023-04-20 17:45", name: "邓二十" },
    { id: 19, root: 3, parent: 8, dialog: 8, content: "我是评论id为19的信息，回复评论id为8", time: "2023-04-20 17:50", name: "冯二十一" },
  
    { id: 20, root: 3, parent: 9, dialog: 9, content: "我是评论id为20的信息，回复评论id为9", time: "2023-04-20 17:55", name: "杨二十二" },
    { id: 21, root: 3, parent: 9, dialog: 9, content: "我是评论id为21的信息，回复评论id为9", time: "2023-04-20 18:00", name: "李二十三" },
  
    // 三级评论下的四级评论
    { id: 22, root: 1, parent: 10, dialog: 4, content: "我是评论id为22的信息，回复评论id为10", time: "2023-04-20 18:05", name: "王二十四" },
    { id: 23, root: 1, parent: 10, dialog: 4, content: "我是评论id为23的信息，回复评论id为10", time: "2023-04-20 18:10", name: "赵二十五" },
  
    { id: 24, root: 1, parent: 11, dialog: 4, content: "我是评论id为24的信息，回复评论id为11", time: "2023-04-20 18:15", name: "钱二十六" },
    { id: 25, root: 1, parent: 11, dialog: 4, content: "我是评论id为25的信息，回复评论id为11", time: "2023-04-20 18:20", name: "孙二十七" },
  
    { id: 26, root: 2, parent: 14, dialog: 6, content: "我是评论id为26的信息，回复评论id为14", time: "2023-04-20 18:25", name: "朱二十八" },
    { id: 27, root: 2, parent: 14, dialog: 6, content: "我是评论id为27的信息，回复评论id为14", time: "2023-04-20 18:30", name: "李二十九" },
  
    { id: 28, root: 2, parent: 15, dialog: 6, content: "我是评论id为28的信息，回复评论id为15", time: "2023-04-20 18:35", name: "周三十" },
    { id: 29, root: 2, parent: 15, dialog: 6, content: "我是评论id为29的信息，回复评论id为15", time: "2023-04-20 18:40", name: "郑三十一" },
  
    { id: 30, root: 3, parent: 18, dialog: 8, content: "我是评论id为30的信息，回复评论id为18", time: "2023-04-20 18:45", name: "吴三十二" },
    { id: 31, root: 3, parent: 18, dialog: 8, content: "我是评论id为31的信息，回复评论id为18", time: "2023-04-20 18:50", name: "邓三十三" },
  
    { id: 32, root: 3, parent: 19, dialog: 9, content: "我是评论id为32的信息，回复评论id为19", time: "2023-04-20 18:55", name: "赵三十四" },
    { id: 33, root: 3, parent: 19, dialog: 9, content: "我是评论id为33的信息，回复评论id为19", time: "2023-04-20 19:00", name: "王三十五" },
  
    { id: 34, root: 3, parent: 20, dialog: 9, content: "我是评论id为34的信息，回复评论id为20", time: "2023-04-20 19:05", name: "孙三十六" },
    { id: 35, root: 3, parent: 20, dialog: 9, content: "我是评论id为35的信息，回复评论id为20", time: "2023-04-20 19:10", name: "李三十七" },
  
    { id: 36, root: 3, parent: 21, dialog: 9, content: "我是评论id为36的信息，回复评论id为21", time: "2023-04-20 19:15", name: "周三十八" },
    { id: 37, root: 3, parent: 21, dialog: 9, content: "我是评论id为37的信息，回复评论id为21", time: "2023-04-20 19:20", name: "郑三十九" },
  
    { id: 38, root: 3, parent: 22, dialog: 10, content: "我是评论id为38的信息，回复评论id为22", time: "2023-04-20 19:25", name: "李四十" },
    { id: 39, root: 3, parent: 22, dialog: 10, content: "我是评论id为39的信息，回复评论id为22", time: "2023-04-20 19:30", name: "王四十一" },
  
    { id: 40, root: 3, parent: 23, dialog: 10, content: "我是评论id为40的信息，回复评论id为23", time: "2023-04-20 19:35", name: "赵四十二" },
    { id: 41, root: 3, parent: 23, dialog: 10, content: "我是评论id为41的信息，回复评论id为23", time: "2023-04-20 19:40", name: "孙四十三" },
  
    { id: 42, root: 3, parent: 24, dialog: 10, content: "我是评论id为42的信息，回复评论id为24", time: "2023-04-20 19:45", name: "冯四十四" },
    { id: 43, root: 3, parent: 24, dialog: 10, content: "我是评论id为43的信息，回复评论id为24", time: "2023-04-20 19:50", name: "吴四十五" },
  
    { id: 44, root: 3, parent: 25, dialog: 10, content: "我是评论id为44的信息，回复评论id为25", time: "2023-04-20 19:55", name: "郑四十六" },
    { id: 45, root: 3, parent: 25, dialog: 10, content: "我是评论id为45的信息，回复评论id为25", time: "2023-04-20 20:00", name: "周四十七" }
  ];
  