package net.n2oapp.framework.config.io.region;

import net.n2oapp.framework.api.metadata.global.view.region.N2oTabsRegion;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import org.jdom.Element;
import org.springframework.stereotype.Component;

/**
 * Чтение\запись региона в виде вкладок.
 */
@Component
public class TabsRegionIOv1 extends BaseRegionIOv1<N2oTabsRegion> {

    @Override
    public void io(Element e, N2oTabsRegion r, IOProcessor p) {
        super.io(e, r, p);
        p.attributeBoolean(e, "always-refresh", r::isAlwaysRefresh, r::setAlwaysRefresh);
    }

    @Override
    public String getElementName() {
        return "tabs";
    }

    @Override
    public Class<N2oTabsRegion> getElementClass() {
        return N2oTabsRegion.class ;
    }
}
