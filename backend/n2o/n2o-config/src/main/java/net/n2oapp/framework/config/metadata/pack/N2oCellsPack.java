package net.n2oapp.framework.config.metadata.pack;

import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oListCell;
import net.n2oapp.framework.api.pack.MetadataPack;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.compile.cell.*;

public class N2oCellsPack implements MetadataPack<N2oApplicationBuilder> {
    @Override
    public void build(N2oApplicationBuilder b) {
        b.packs(new N2oCellsIOPack());
        b.compilers(new TextCellCompiler(),
                new ProgressBarCellCompiler(),
                new ImageCellCompiler(),
                new IconCellCompiler(),
                new CustomCellCompiler(),
                new LinkCellCompiler(),
                new BadgeCellCompiler(),
                new CheckboxCellCompiler(),
                new ToolbarCellCompiler(),
                new EditCellCompiler());
    }
}
