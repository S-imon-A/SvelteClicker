import trees_data from "$lib/data/tree_data.json"

export interface LeafStats {
    image: string,
    cost: number,
    sizeRange: Array<number>,
    amount: number,
    costAdd: number,
    costMulti: number
}

export interface TreeStats {
    id: number,
    image: string,
    health: number,
    price: number,
    leafs: LeafStats
    xp: number
}

function getDefaultTreeStats(): TreeStats {
    const tree: any = trees_data.trees[0]

    return {
        id: tree.id,
        image: tree.image,
        health: tree.health,
        price: tree.price,
        leafs: {
            image: tree.leafs.image,
            cost: tree.leafs.cost,
            sizeRange: tree.leafs.size_range,
            amount: tree.leafs.amount,
            costAdd: 0,
            costMulti: 1
        },
        xp: tree.xp
    }
}

export function getTreeStats(treeId: number): TreeStats {
    for (const tree of trees_data.trees) {
        if (tree.id !== treeId) continue

        const treeStats: TreeStats = {
            id: tree.id,
            image: tree.image,
            health: tree.health,
            price: tree.price,
            leafs: {
                image: tree.leafs.image,
                cost: tree.leafs.cost,
                sizeRange: tree.leafs.size_range,
                amount: tree.leafs.amount,
                costAdd: 0,
                costMulti: 1
            },
            xp: tree.xp
        }

        return treeStats
    }

    return getDefaultTreeStats()
}

export function getTreesCount(): number {
    return trees_data.trees.length
}