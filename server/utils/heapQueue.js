function bubbleDown(heap, startPOS, pos) {
    let newItem = heap[pos]

    //follow path to the root, moving parents down until 
    //finding a place newItem fits.
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

    //bubble up the smaller child until hitting a leaf
    let childPOS = 2*pos + 1    //leftmost child position
    while (childPOS < endPOS) {
        let rightPOS = childPOS + 1   //set childpos to index of smaller child.
        if (rightPOS < endPOS) {
            if (!(heap[childPOS][0] < heap[rightPOS][0])) {
                childPOS = rightPOS
            }
        }
            
        heap[pos] = heap[childPOS]     //move the smaller child up
        pos = childPOS
        childPOS = 2*pos + 1
    }

    //the leaf at pos is now empty
    //put newitem there, and bubble it up to its final resting place
    //(by sifting its parents down)
    heap[pos] = newItem
    bubbleDown(heap, startPOS, pos)
}

function heapPush(heap, item) {
    //push item onto heap, maintaining the heap invariant
    heap.push(item)
    bubbleDown(heap, 0, heap.length-1)
}

function heapPop(heap) {
    //pop the smallest item off the heap, maintaining the heap invariant
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