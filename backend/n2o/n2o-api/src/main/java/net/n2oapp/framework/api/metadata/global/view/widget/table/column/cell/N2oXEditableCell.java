package net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell;

import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.metadata.control.N2oField;
import net.n2oapp.framework.api.metadata.global.view.widget.table.EditType;

/**
 * Ячейка позволяющая изменять содержимое таблицы
 */
@Getter
@Setter
public class N2oXEditableCell extends N2oActionCell {
    private N2oField n2oField;
    private String controlScr;
    private String format;
    private EditType editType;
}
