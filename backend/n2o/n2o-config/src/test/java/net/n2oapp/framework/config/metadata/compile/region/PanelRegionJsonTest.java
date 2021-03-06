package net.n2oapp.framework.config.metadata.compile.region;


import net.n2oapp.framework.config.io.page.SimplePageElementIOv2;
import net.n2oapp.framework.config.io.page.StandardPageElementIOv2;
import net.n2oapp.framework.config.io.region.PanelRegionIOv1;
import net.n2oapp.framework.config.io.widget.HtmlWidgetElementIOv4;
import net.n2oapp.framework.config.metadata.compile.page.StandardPageCompiler;
import net.n2oapp.framework.config.metadata.compile.widget.HtmlWidgetCompiler;
import net.n2oapp.framework.config.test.JsonMetadataTestBase;
import org.junit.Before;
import org.junit.Test;

/**
 * Тестирование маппинга java модели в json для региона в виде панелей
 */
public class PanelRegionJsonTest extends JsonMetadataTestBase {
    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
        builder.ios(new SimplePageElementIOv2(), new StandardPageElementIOv2(), new PanelRegionIOv1(), new HtmlWidgetElementIOv4())
                .compilers(new PanelRegionCompiler(), new StandardPageCompiler(), new HtmlWidgetCompiler());
    }

    @Test
    public void panelRegion() {
        check("net/n2oapp/framework/config/mapping/testPanelRegionJson.page.xml",
                "components/regions/Panel/PanelRegion.meta.json")
                .cutXml("regions.single[0]")
                .exclude("id", "panels[0].opened", "panels[0].isVisible", "panels[0].dependency", "panels[0].widgetId", "panels[1]")
                .assertEquals();
    }
}
