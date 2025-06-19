let count = 0;
const createTree = (arr, parentId = "") => {
        const tree = [];
        arr.forEach(item => {
            if (String(item.parent_id) === String(parentId)) {
                count++;
                const newItem = item
                newItem.index = count;
                const children = createTree(arr, item._id);
                if (children.length) {
                    newItem.children = children;
                }
                tree.push(newItem);
            }
        });
        return tree;
    }

module.exports.Tree = (arr, parentId = "") => {
        count = 0;
        const tree = createTree(arr, parentId = "");
        return tree;
}