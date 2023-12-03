function _siftdown(heap, startpos, pos) {
    const newitem = heap[pos]

    while (pos > startpos) {
        parentpos = (pos - 1) >> 1
        parent = heap[parentpos]
        if (newitem < parent) {
            heap[pos] = parent
            pos = parentpos
            continue
        }
        break
    }
    heap[pos] = newitem
}

function _siftup(heap, pos) {
    const endpos = heap.length
    const startpos = pos
    const newitem = heap[pos]

    var childpos = 2*pos + 1    //leftmost child position
    while (childpos < endpos) {
        rightpos = childpos + 1
        if ((rightpos < endpos) && !(heap[childpos] < heap[rightpos])) {
            childpos = rightpos
        }
            
        heap[pos] = heap[childpos]
        pos = childpos
        childpos = 2*pos + 1
    }

    heap[pos] = newitem
    _siftdown(heap, startpos, pos)
}

function heappush(heap, item) {
    heap.push(item)
    _siftdown(heap, 0, heap.length-1)
}

function heappop(heap) {
    const lastelt = heap.pop()
    if (heap) {
        const returnitem = heap[0]
        heap[0] = lastelt
        _siftup(heap, 0)
        return returnitem
    }
    return lastelt
}

module.exports = {
    heappush,
    heappop
}