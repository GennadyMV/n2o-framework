package net.n2oapp.framework.config.io.widget.chart;

import net.n2oapp.framework.api.metadata.global.view.widget.chart.N2oChart;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import net.n2oapp.framework.api.metadata.io.NamespaceIO;
import net.n2oapp.framework.config.io.widget.WidgetIOv4;
import org.jdom.Element;
import org.springframework.stereotype.Component;

/**
 * Чтение/запись абстрактной диаграммы
 */
@Component
public abstract class AbstractChartIOv4<T extends N2oChart> implements WidgetIOv4, NamespaceIO<T> {

    @Override
    public void io(Element e, T с, IOProcessor p) {
        p.attributeInteger(e, "width", с::getWidth, с::setWidth);
        p.attributeInteger(e, "height", с::getHeight, с::setHeight);
    }
}
