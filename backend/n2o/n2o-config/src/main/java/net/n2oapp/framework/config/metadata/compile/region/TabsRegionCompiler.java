package net.n2oapp.framework.config.metadata.compile.region;

import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.region.N2oTabsRegion;
import net.n2oapp.framework.api.metadata.global.view.widget.N2oWidget;
import net.n2oapp.framework.api.metadata.meta.page.PageRoutes;
import net.n2oapp.framework.api.metadata.meta.region.TabsRegion;
import net.n2oapp.framework.config.metadata.compile.IndexScope;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import net.n2oapp.framework.config.metadata.compile.redux.Redux;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

import static net.n2oapp.framework.api.metadata.compile.building.Placeholders.property;

/**
 * Компиляция региона в виде вкладок.
 */
@Component
public class TabsRegionCompiler extends BaseRegionCompiler<TabsRegion, N2oTabsRegion> {

    @Override
    protected String getPropertyRegionSrc() {
        return "n2o.api.region.tabs.src";
    }

    @Override
    public Class<N2oTabsRegion> getSourceClass() {
        return N2oTabsRegion.class;
    }

    @Override
    public TabsRegion compile(N2oTabsRegion source, PageContext context, CompileProcessor p) {
        TabsRegion region = new TabsRegion();
        build(region, source, p);
        region.setTabs(new ArrayList<>());
        region.setPlace(source.getPlace());
        region.setItems(initItems(source, p, TabsRegion.Tab.class));
        region.setAlwaysRefresh(source.getAlwaysRefresh() != null ? source.getAlwaysRefresh() : false);
        region.setLazy(p.cast(source.getLazy(), p.resolve(property("n2o.api.region.tabs.lazy"), Boolean.class)));
        compileTabsRoute(source, region.getId(), p);
        return region;
    }

    private void compileTabsRoute(N2oTabsRegion source, String regionId, CompileProcessor p) {
        String activeParam = p.cast(source.getActiveParam(), regionId);
        Boolean routable = p.cast(source.getRoutable(), p.resolve(property("n2o.api.region.tabs.routable"), Boolean.class));

        PageRoutes routes = p.getScope(PageRoutes.class);
        if (routes == null || !Boolean.TRUE.equals(routable))
            return;

        routes.addQueryMapping(
                activeParam,
                Redux.dispatchSetActiveRegionEntity(regionId, activeParam),
                Redux.createActiveRegionEntityLink(regionId)
        );
    }

    @Override
    protected String createId(String regionPlace, CompileProcessor p) {
        return createId(regionPlace, "tab", p);
    }

    @Override
    protected TabsRegion.Tab createItem(N2oWidget widget, IndexScope index, CompileProcessor p) {
        TabsRegion.Tab tab = new TabsRegion.Tab();
        boolean first = index.isFirst();
        tab.setId("tab" + index.get());

        String label = null;
        String icon = null;
        if (widget.getRefId() != null) {
            N2oWidget referable = p.getSource(widget.getRefId(), widget.getClass());
            if (referable != null) {
                label = referable.getName();
                icon = referable.getIcon();
            }
        }
        tab.setLabel(p.cast(widget.getName(), label));
        tab.setIcon(p.cast(widget.getIcon(), icon));

        tab.setOpened(p.cast(widget.getOpened(), first ? true : null, false));
        tab.setFetchOnInit(tab.getOpened());
        tab.setProperties(p.mapAttributes(widget));
        return tab;
    }

}
