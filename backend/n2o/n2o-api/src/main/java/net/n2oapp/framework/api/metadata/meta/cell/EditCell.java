package net.n2oapp.framework.api.metadata.meta.cell;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.metadata.Component;
import net.n2oapp.framework.api.metadata.global.view.widget.table.EditType;
import net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell.N2oActionCell;

/**
 * Клиентская модель редактируемой ячейки таблицы
 */
@Getter
@Setter
public class EditCell extends N2oActionCell {
    @JsonProperty
    private Component control;
    @JsonProperty
    private String format;
    @JsonProperty
    private String editFieldId;
    @JsonProperty
    private EditType editType;
    @JsonProperty("editable")
    private Object enabled;
}
