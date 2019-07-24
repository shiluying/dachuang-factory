function Node(value) {
    this.data = value;
    this.previous = null;
    this.next = null;
}
 
function DoublyList() {
    this._length = 0;
    this.head = null;
    this.tail = null;
}
 
DoublyList.prototype.add = function(value) {
    var node = new Node(value);
    if (this._length) {
        this.tail.next = node;
        node.previous = this.tail;
        this.tail = node;
        this.head.previous = this.tail;
        this.tail.next = this.head;
    } else {
        this.head = node;
        this.tail = node;
        this.head.previous = this.tail;
        this.tail.next = this.head;
    }
    this._length++;
    return node;
};
 
DoublyList.prototype.searchNodeAt = function(position) {
    var currentNode = this.head;
    var length = this._length;
    var count = 1;
    if (length === 0 || position < 1 || position > length) {
        return -1;
    }
    while (count < position) {
        currentNode = currentNode.next;
        count++;
    }
    return currentNode;
};