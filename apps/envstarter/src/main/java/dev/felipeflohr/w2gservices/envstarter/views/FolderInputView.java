package dev.felipeflohr.w2gservices.envstarter.views;

import lombok.CustomLog;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

@CustomLog
public class FolderInputView extends JPanel {
    private JLabel directoryInputLabel;
    private JTextField directoryInput;
    private JButton chooseDirectoryButton;
    private JLabel discordTokenInputLabel;
    private JTextField discordTokenInput;
    private final List<Consumer<String>> listeners = new ArrayList<>();

    public FolderInputView() {
        super();
        init();
    }

    public void addListener(Consumer<String> callback) {
        listeners.add(callback);
    }

    public void setDirectoryValid(boolean valid) {
        discordTokenInputLabel.setEnabled(valid);
        discordTokenInput.setEditable(valid);
    }

    public String getDiscordToken() {
        return discordTokenInput.getText();
    }

    public String getPath() {
        return directoryInput.getText();
    }

    private void init() {
        this.directoryInput = createDirectoryInput();
        this.chooseDirectoryButton = createChooseDirectoryButton();
        this.directoryInputLabel = createDirectoryInputLabel();
        this.discordTokenInputLabel = createDiscordTokenInputLabel();
        this.discordTokenInput = createDiscordTokenInput();
        setLayout();
    }

    private void setLayout() {
        var layout = new GridBagLayout();
        var constraints = new GridBagConstraints();
        this.setLayout(layout);

        constraints.fill = GridBagConstraints.HORIZONTAL;
        renderInputLabel(constraints);
        renderDirectoryInput(constraints);
        renderChooseDirectoryButton(constraints);
        renderDiscordTokenInputLabel(constraints);
        renderDiscordTokenInput(constraints);
    }

    private void renderInputLabel(GridBagConstraints constraints) {
        constraints.weightx = 1;
        constraints.gridx = 0;
        constraints.gridy = 0;
        this.add(directoryInputLabel);
    }

    private void renderDirectoryInput(GridBagConstraints constraints) {
        constraints.weightx = 1;
        constraints.gridx = 0;
        constraints.gridy = 1;
        this.add(directoryInput, constraints);
    }

    private void renderChooseDirectoryButton(GridBagConstraints constraints) {
        constraints.weightx = 0;
        constraints.gridx = 1;
        constraints.gridy = 1;
        this.add(chooseDirectoryButton, constraints);
    }

    private void renderDiscordTokenInputLabel(GridBagConstraints constraints) {
        constraints.weightx = 1;
        constraints.gridx = 0;
        constraints.gridy = 2;
        this.add(discordTokenInputLabel, constraints);
    }

    private void renderDiscordTokenInput(GridBagConstraints constraints) {
        constraints.weightx = 1;
        constraints.gridx = 0;
        constraints.gridy = 3;
        this.add(discordTokenInput, constraints);
    }

    private JTextField createDirectoryInput() {
        var textField = new JTextField();
        textField.setEditable(false);
        return textField;
    }

    private JButton createChooseDirectoryButton() {
        var button = new JButton("Select...");
        button.addActionListener(actionEvent -> {
            String folderChosen = renderAndGetFileDialog();
            if (folderChosen != null) {
                directoryInput.setText(folderChosen);
                listeners.forEach(listener -> listener.accept(folderChosen));
            }
        });
        return button;
    }

    private JLabel createDirectoryInputLabel() {
        return new JLabel("Select the root directory of the project:");
    }

    private JLabel createDiscordTokenInputLabel() {
        var label = new JLabel("Insert the Discord token:");
        label.setEnabled(false);
        return label;
    }

    private JTextField createDiscordTokenInput() {
        var textField = new JTextField();
        textField.setEditable(false);
        return textField;
    }

    private String renderAndGetFileDialog() {
        var fileChooser = new JFileChooser();
        fileChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);

        try {
            String home = System.getProperty("user.home");
            if (home != null) {
                fileChooser.setCurrentDirectory(new File(home));
            }
        } catch (Exception e) {
            log.error(e);
        }

        int result = fileChooser.showOpenDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFolder = fileChooser.getSelectedFile();
            log.info("Selected folder: " + selectedFolder.getAbsolutePath());
            return selectedFolder.getAbsolutePath();
        }
        return null;
    }
}
