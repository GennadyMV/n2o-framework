package net.n2oapp.framework.api.metadata.global.view.widget.table.column.cell;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import net.n2oapp.framework.api.metadata.aware.CssClassAware;

import java.util.Map;

/**
 * Абстрактная ячейка
 */
@Getter
@Setter
public abstract class N2oAbstractCell implements N2oCell, CssClassAware {
    @JsonProperty
    private String id;
    @JsonProperty
    private String fieldKey;
    @JsonProperty
    private String src;
    private String namespaceUri;
    @JsonProperty("className")
    private String cssClass;
    @JsonProperty("style")
    private Map<String, String> reactStyle;
    private String style;
    private String visible;
    @JsonProperty("visible")
    private Object jsonVisible;
}
