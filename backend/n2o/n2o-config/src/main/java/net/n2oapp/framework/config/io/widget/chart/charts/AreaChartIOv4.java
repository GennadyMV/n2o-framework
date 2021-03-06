package net.n2oapp.framework.config.io.widget.chart.charts;

import net.n2oapp.framework.api.metadata.global.view.widget.chart.N2oAreaChartItem;
import net.n2oapp.framework.api.metadata.global.view.widget.chart.N2oAreaChart;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import net.n2oapp.framework.api.metadata.meta.widget.chart.ChartLineType;
import org.jdom2.Element;
import org.springframework.stereotype.Component;

/**
 * Чтение/запись компонента диаграммы-области
 */
@Component
public class AreaChartIOv4 extends StandardChartIOv4<N2oAreaChart> {

    @Override
    public void io(Element e, N2oAreaChart c, IOProcessor p) {
        super.io(e, c, p);
        p.children(e, null, "area", c::getItems, c::setItems, N2oAreaChartItem.class, this::areaChartIOv4);
    }

    private void areaChartIOv4(Element e, N2oAreaChartItem c, IOProcessor p) {
        p.attribute(e, "field-id", c::getFieldId, c::setFieldId);
        p.attributeEnum(e, "line-type", c::getLineType, c::setLineType, ChartLineType.class);
        p.attribute(e, "color", c::getColor, c::setColor);
        p.attribute(e, "stroke-color", c::getStrokeColor, c::setStrokeColor);
        p.attributeBoolean(e, "has-label", c::getHasLabel, c::setHasLabel);
    }

    @Override
    public Class<N2oAreaChart> getElementClass() {
        return N2oAreaChart.class;
    }

    @Override
    public String getElementName() {
        return "areas";
    }
}
