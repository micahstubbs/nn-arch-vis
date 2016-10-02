

This example takes <a href='http://bl.ocks.org/bjtucker/'>bjtucker</a>'s block: <a href='http://bl.ocks.org/bjtucker/151f6344ffd02105a67a'>Bounded Force Layout - force rank by group</a> and swaps out the dataset, showing energy flows from _source_ to _use_.  

This example also adds a [Simple D3 tooltip](http://blockbuilder.org/biovisualize/1016860). Hat tip to [biovisualize](http://bl.ocks.org/biovisualize) for that bl.ock.

See another view of this energy flow data at the bl.ock [Sankey Particles - Transparent Links](http://bl.ocks.org/micahstubbs/b7e78429ce54abc2154f)

---

**README.md from the original bl.ock**

---

This [D3](http://d3js.org/) example shows how to constrain the position of nodes within the rectangular bounds of the containing SVG element. As a side-effect of updating the node's `cx` and `cy` attributes, we update the node positions to be within the range [radius, width - radius] for *x*, [radius, height - radius] for *y*. If you prefer, you could use the `each` operator to do this as a separate step, rather than as a side-effect of setting attributes.

Wrote the `each` operator step described above, but used tick to settle groups into separate ranks. -bjtucker
 