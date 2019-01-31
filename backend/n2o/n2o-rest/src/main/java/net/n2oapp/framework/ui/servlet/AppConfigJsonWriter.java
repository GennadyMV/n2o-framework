package net.n2oapp.framework.ui.servlet;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import net.n2oapp.framework.api.JsonUtil;
import net.n2oapp.framework.api.StringUtils;
import net.n2oapp.framework.api.context.ContextProcessor;
import net.n2oapp.framework.api.exception.N2oException;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class AppConfigJsonWriter {
    private static final Logger log = LoggerFactory.getLogger(AppConfigJsonWriter.class);
    private String path;
    private String overridePath;
    private Properties properties;
    private ContextProcessor contextProcessor;
    private List<String> configs;
    private ObjectMapper objectMapper;


    public void loadValues() {
        if (configs == null)
            configs = new ArrayList<>();
        configs.addAll(readConfigs());
    }



    public void writeValues(PrintWriter out, Map<String, ?> addedValues) throws IOException {
        ObjectNode objectNode = objectMapper.createObjectNode();
        ObjectNode configsNode = retrieveConfig(configs);
        for (String key : addedValues.keySet()) {
            objectNode.set(key, objectMapper.valueToTree(addedValues.get(key)));
        }
        if (configsNode != null)
            JsonUtil.merge(objectNode, configsNode);

        objectMapper.writeValue(out, objectNode);
    }

    private ObjectNode retrieveConfig(List<String> configs) {
        ObjectNode res = null;
        if (configs == null)
            return null;
        for (String config : configs) {
            try {
                if (res == null) res = read(config);
                else JsonUtil.merge(res, read(config));
            } catch (IOException e) {
                throw new N2oException(e);
            }
        }
        return res;
    }

    private ObjectNode read(String json) throws IOException {
        String text = json;
        if (properties != null)
            text = StringUtils.resolveProperties(text, properties);
        if (contextProcessor != null)
            text = contextProcessor.resolveJson(text, objectMapper);
        return (ObjectNode) objectMapper.readTree(text);
    }

    private List<String> readConfigs() {
        List<String> configs = new ArrayList<>();
        try {
            if (path != null)
                load(configs, path);
            if (overridePath != null)
                load(configs, overridePath);
        } catch (IOException e) {
            throw new N2oException(e);
        }
        return configs;
    }

    private void load(List<String> configs, String path) throws IOException {
        PathMatchingResourcePatternResolver r = new PathMatchingResourcePatternResolver();
        for (Resource resource : r.getResources(path)) {
            try (InputStream is = resource.getInputStream()) {
                if (is != null) {
                    String text = IOUtils.toString(is, "UTF-8");
                    configs.add(text);
                } else {
                    log.debug("{} not found.", path);
                }
            } catch (IOException e) {
                throw new N2oException(e);
            }
        }
    }

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    public void setContextProcessor(ContextProcessor contextProcessor) {
        this.contextProcessor = contextProcessor;
    }

    public void setObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setConfigs(List<String> configs) {
        this.configs = configs;
    }

    public void setOverridePath(String overridePath) {
        this.overridePath = overridePath;
    }
}