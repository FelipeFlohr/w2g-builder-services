package dev.felipeflohr.w2gservices.envstarter;

import dev.felipeflohr.w2gservices.envstarter.views.MainView;
import lombok.CustomLog;

import java.util.logging.Level;
import java.util.logging.Logger;

@CustomLog
public class Main {
    public static void main(String[] args) {
        var view = new MainView();
        view.setVisible(true);
        log.info("View created.");
    }
}