function _siftdown(heap, startpos, pos) {
    var newitem = heap[pos]

    while (pos > startpos) {
        var parentpos = (pos - 1) >> 1
        var parent = heap[parentpos]
        if (newitem[0] < parent[0]) {
            heap[pos] = parent
            pos = parentpos
            continue
        }
        break
    }
    heap[pos] = newitem
}

function _siftup(heap, pos) {
    var endpos = heap.length
    var startpos = pos
    var newitem = heap[pos]

    var childpos = 2*pos + 1    //leftmost child position
    while (childpos < endpos) {
        var rightpos = childpos + 1
        if (rightpos < endpos) {
            if (!(heap[childpos][0] < heap[rightpos][0])) {
                childpos = rightpos
            }
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
    var lastelt = heap.pop()
    if (heap.length > 0) {
        var returnitem = heap[0]
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