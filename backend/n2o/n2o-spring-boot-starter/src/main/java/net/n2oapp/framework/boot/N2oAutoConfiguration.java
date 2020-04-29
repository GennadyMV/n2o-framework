package net.n2oapp.framework.boot;

import net.n2oapp.framework.config.ConfigStarter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.event.EventListener;

/**
 * Конфигурация N2O
 */
@Configuration
@Import({N2oMessagesConfiguration.class,
        N2oContextConfiguration.class,
        N2oCommonConfiguration.class,
        N2oEngineConfiguration.class,
        N2oMetadataConfiguration.class,
        N2oRestConfiguration.class})
@ServletComponentScan("net.n2oapp.framework")
@ComponentScan(basePackages = "net.n2oapp.framework.api", lazyInit = true)
public class N2oAutoConfiguration {

    @Autowired
    private ConfigStarter starter;

    @EventListener(ApplicationReadyEvent.class)
    public void start() {
        starter.start();
    }

}