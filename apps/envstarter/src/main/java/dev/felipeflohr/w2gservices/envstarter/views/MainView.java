package dev.felipeflohr.w2gservices.envstarter.views;

import dev.felipeflohr.w2gservices.envstarter.services.CheckerService;
import dev.felipeflohr.w2gservices.envstarter.services.EnvironmentGeneratorService;
import dev.felipeflohr.w2gservices.envstarter.views.components.GenerateButton;

import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import java.awt.BorderLayout;
import java.util.List;

public class MainView extends JFrame {
    private JButton generateButton;
    private FolderInputView folderInputView;
    private final CheckerService checkerService = CheckerService.getInstance();
    private final EnvironmentGeneratorService environmentGeneratorService = EnvironmentGeneratorService.getInstance();

    public MainView() {
        super();
        init();
    }

    private void init() {
        this.setTitle("Watch2Gether services - Environment starter");
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLookAndFeel();
        defineDimension();

        this.setLayout(new BorderLayout());
        this.generateButton = getGenerateButton();
        this.folderInputView = getFolderInputView();
        this.add(generateButton, BorderLayout.SOUTH);
        this.add(folderInputView, BorderLayout.CENTER);
    }

    private void setLookAndFeel() {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException |
                 UnsupportedLookAndFeelException e) {
            JFrame.setDefaultLookAndFeelDecorated(true);
        }
    }

    private void defineDimension() {
        this.setSize(800, 256);
        this.setResizable(false);
        this.setLocationRelativeTo(null);
    }

    private JButton getGenerateButton() {
        var button = new GenerateButton();
        button.setEnabled(false);
        button.addActionListener(actionEvent -> environmentGeneratorService.generateFiles(folderInputView.getPath(), folderInputView.getDiscordToken()));
        return button;
    }

    private FolderInputView getFolderInputView() {
        var folderInputView = new FolderInputView();
        folderInputView.addListener(path -> {
            if (path.endsWith(".")) {
                path = path.substring(0, path.length() - 1);
            }
            List<String> pathValidation = checkerService.isValidPath(path);
            boolean valid = pathValidation.isEmpty();

            generateButton.setEnabled(valid);
            folderInputView.setDirectoryValid(valid);
            showDialogForValidation(pathValidation);
        });
        return folderInputView;
    }

    private void showDialogForValidation(List<String> messages) {
        if (!messages.isEmpty()) {
            String messageToShow = String.join("\n", messages);
            var optionPane = new JOptionPane(messageToShow, JOptionPane.ERROR_MESSAGE);
            var dialog = new JDialog(this, "Validation error", true);

            dialog.setContentPane(optionPane);
            dialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
            dialog.pack();
            dialog.setResizable(false);
            dialog.setLocationRelativeTo(null);
            dialog.setVisible(true);
        }
    }
}
