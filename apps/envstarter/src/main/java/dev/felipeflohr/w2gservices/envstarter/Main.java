package dev.felipeflohr.w2gservices.envstarter;

import dev.felipeflohr.w2gservices.envstarter.views.MainView;
import lombok.CustomLog;

@CustomLog
public class Main {
    public static void main(String[] args) {
        try {
            var view = new MainView();
            view.setVisible(true);
            log.info("View created.");
        } catch (Exception e) {
            log.fatal(e);
            throw e;
        }
    }
}