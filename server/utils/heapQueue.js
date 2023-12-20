function bubbleDown(heap, startPOS, pos) {
    let newItem = heap[pos]

    while (pos > startPOS) {
        let parentPOS = (pos - 1) >> 1
        let parent = heap[parentPOS]
        if (newItem[0] < parent[0]) {
            heap[pos] = parent
            pos = parentPOS
            continue
        }
        break
    }
    heap[pos] = newItem
}

function bubbleUp(heap, pos) {
    let endPOS = heap.length
    let startPOS = pos
    let newItem = heap[pos]

    let childPOS = 2*pos + 1    //leftmost child position
    while (childPOS < endPOS) {
        let rightPOS = childPOS + 1
        if (rightPOS < endPOS) {
            if (!(heap[childPOS][0] < heap[rightPOS][0])) {
                childPOS = rightPOS
            }
        }
            
        heap[pos] = heap[childPOS]
        pos = childPOS
        childPOS = 2*pos + 1
    }

    heap[pos] = newItem
    bubbleDown(heap, startPOS, pos)
}

function heapPush(heap, item) {
    heap.push(item)
    bubbleDown(heap, 0, heap.length-1)
}

function heapPop(heap) {
    let lastElement = heap.pop()
    if (heap.length > 0) {
        let returnItem = heap[0]
        heap[0] = lastElement
        bubbleUp(heap, 0)
        return returnItem
    }
    return lastElement
}

module.exports = {
    heapPush,
    heapPop
}