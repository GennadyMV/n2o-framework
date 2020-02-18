package net.n2oapp.framework.autotest.api.component.control;

/**
 * Ввод текста для автотестирования
 */
public interface MaskedInputControl extends Control {
    String val();

    void val(String value);

    void shouldHaveValue(String value);
}
