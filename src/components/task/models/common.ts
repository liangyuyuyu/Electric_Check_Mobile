export enum Namespaces {
    home = "home"
}

// 联系人首字母的冒泡排序
export function contactsBubbleSort(items: any) {
    for (var i = 0; i < items.length - 1; i++) {
        for (var j = 0; j < items.length - i - 1; j++) {
            if (items[j].firstLetter > items[j + 1].firstLetter) {
                //把大的数字放到后面
                var swap = items[j];
                items[j] = items[j + 1];
                items[j + 1] = swap;
            }
        }
    }
    return items;
}