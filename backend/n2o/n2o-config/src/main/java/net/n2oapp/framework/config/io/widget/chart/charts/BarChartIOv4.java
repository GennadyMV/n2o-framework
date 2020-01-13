package net.n2oapp.framework.config.io.widget.chart.charts;

import net.n2oapp.framework.api.metadata.global.view.widget.chart.N2oBarChart;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import org.jdom.Element;
import org.springframework.stereotype.Component;

/**
 * Чтение/запись гистограммы
 */
@Component
public class BarChartIOv4 extends StandardChartIOV4<N2oBarChart> {
    @Override
    public void io(Element e, N2oBarChart c, IOProcessor p) {
        super.io(e, c, p);
        p.attribute(e, "stack-id", c::getStackId, c::setStackId);
        p.attribute(e, "data-key", c::getDataKey, c::setDataKey);
        p.attribute(e, "color", c::getColor, c::setColor);
    }

    @Override
    public Class<N2oBarChart> getElementClass() {
        return N2oBarChart.class;
    }

    @Override
    public String getElementName() {
        return "bar";
    }
}
