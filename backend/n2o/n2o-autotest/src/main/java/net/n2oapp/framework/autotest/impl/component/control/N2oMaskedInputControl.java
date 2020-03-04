package net.n2oapp.framework.autotest.impl.component.control;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.SelenideElement;
import net.n2oapp.framework.autotest.api.component.control.MaskedInputControl;
import org.openqa.selenium.Keys;

/**
 * Ввод текста с маской для автотестирования
 */
public class N2oMaskedInputControl extends N2oControl implements MaskedInputControl {

    @Override
    public String val() {
        SelenideElement elm = element().parent().$(".n2o-input-mask");
        return elm.exists() ? elm.val() : element().$(".n2o-editable-cell .n2o-editable-cell-text").text();
    }

    @Override
    public void val(String value) {
        element().parent().$(".n2o-input-mask").sendKeys(Keys.chord(Keys.CONTROL, "a"), value);
        element().parent().$(".n2o-input-mask").pressEnter();
    }

    @Override
    public void shouldHaveValue(String value) {
        SelenideElement elm = element().parent().$(".n2o-input-mask");
        if (elm.exists()) elm.shouldHave(value == null || value.isEmpty() ?
                Condition.empty : Condition.value(value));
        else element().$(".n2o-editable-cell .n2o-editable-cell-text").shouldHave(value == null || value.isEmpty() ?
                Condition.empty : Condition.text(value));
    }

    @Override
    public void shouldHavePlaceholder(String value) {
        Condition condition = Condition.attribute("placeholder", value);

        SelenideElement elm = element().parent().$(".n2o-input-mask");
        if (elm.exists()) elm.shouldHave(condition);
        else element().$(".n2o-editable-cell .n2o-editable-cell-text").shouldHave(condition);
    }
}
