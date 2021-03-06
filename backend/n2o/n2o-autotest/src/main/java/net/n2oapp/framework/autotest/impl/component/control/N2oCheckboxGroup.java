package net.n2oapp.framework.autotest.impl.component.control;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.SelenideElement;
import net.n2oapp.framework.autotest.api.component.control.CheckboxGroup;

/**
 * Компонент группы чекбоксов для автотестирования
 */
public class N2oCheckboxGroup extends N2oControl implements CheckboxGroup {

    @Override
    public void shouldHaveValue(String value) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void shouldBeEmpty() {
        element().$$(".n2o-checkbox .n2o-input").find(Condition.checked).shouldNotBe(Condition.exist);
    }

    @Override
    public void check(String label) {
        if (!inputElement(label).isSelected())
            inputElement(label).shouldBe(Condition.exist).parent().$("label").click();
    }

    @Override
    public void uncheck(String label) {
        if (inputElement(label).isSelected())
            inputElement(label).shouldBe(Condition.exist).parent().$("label").click();
    }

    @Override
    public void shouldBeChecked(String label) {
        inputElement(label).shouldBe(Condition.checked);
    }

    @Override
    public void shouldBeUnchecked(String label) {
        inputElement(label).shouldNotBe(Condition.checked);
    }

    private SelenideElement inputElement(String label) {
        return element().$$(".n2o-checkbox").findBy(Condition.text(label)).$(".n2o-input");
    }

}
