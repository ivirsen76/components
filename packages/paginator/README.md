# @ieremeev/paginator

@ieremeev/paginator provides you with a pagination react component.


### Props

* **total** - (type: number, default: 0)<br>
Total number of pages. If equals 0 then the component shows nothing.

* **currentPage** - (type: number, default: 1)<br>
Current page

* **aroundPages** - (type: number, default: 3)<br>
Minimum number of pages around the current page

* **edgePages** - (type: number, default: 3)<br>
Minimum number of pages at the beginning and at the end

* **showAngularLinks** - (type: boolean, default: true)<br>
Show "Next" and "Prev" links or not?

* **showEdgeLinks** - (type: boolean, default: true)<br>
Show "First" and "Last" links or not?

* **minPages** - (type: number, default: 10)<br>
Minimum number of pages which will no be splitted

* **onPageChange** - (type: function, default: function(newPage) {})<br>
Function called after changing page.
