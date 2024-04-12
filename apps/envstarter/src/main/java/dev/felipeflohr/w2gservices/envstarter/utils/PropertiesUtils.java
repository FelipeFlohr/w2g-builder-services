package dev.felipeflohr.w2gservices.envstarter.utils;

import lombok.CustomLog;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@CustomLog
public class PropertiesUtils {
    public static Map<String, String> readPropertyFileToMap(String path) {
        try {
            Properties prop = new Properties();
            InputStream stream = new FileInputStream(path);
            prop.load(stream);

            Map<String, String> map = new HashMap<>();
            prop.keySet()
                .stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .forEach(k -> {
                    map.put(k, (String) prop.get(k));
                });
            return map;
        } catch (Exception e) {
            log.error(e);
            return new HashMap<>();
        }
    }

    public static String propertyMapToPropertyString(Map<String, String> properties) {
        var sb = new StringBuilder();
        for (Map.Entry<String, String> entry : properties.entrySet()) {
            sb.append(entry.getKey() + "=" + entry.getValue() + "\n");
        }
        return sb.toString();
    }
}
