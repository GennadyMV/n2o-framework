package net.n2oapp.framework.autotest.impl.component.control;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.SelenideElement;
import net.n2oapp.framework.autotest.api.component.control.Slider;
import org.openqa.selenium.Keys;

/**
 * Компонент ползунок для автотестирования
 */
public class N2oSlider extends N2oControl implements Slider {

    @Override
    public void shouldBeEmpty() {
        throw new UnsupportedOperationException();
    }

    @Override
    public void val(String value) {
        val(sliderElement(0), value, 1);
    }

    @Override
    public void val(String value, int step) {
        val(sliderElement(0), value, step);
    }

    @Override
    public void valLeft(String value) {
        val(value);
    }

    @Override
    public void valLeft(String value, int step) {
        val(value, step);
    }

    @Override
    public void valRight(String value) {
        val(sliderElement(1), value, 1);
    }

    @Override
    public void valRight(String value, int step) {
        val(sliderElement(1), value, step);
    }

    private void val(SelenideElement element, String value, int step) {
        String current = element.getAttribute("aria-valuenow");
        int dif = (Integer.parseInt(current) - Integer.parseInt(value)) / step;
        Keys keys = dif > 0 ? Keys.ARROW_LEFT : Keys.ARROW_RIGHT;
        element.click();
        for (int i = 0; i < Math.abs(dif); i++)
            element.sendKeys(keys);
    }

    @Override
    public void shouldHaveValue(String value) {
        shouldHaveValue(sliderElement(0), value);
    }

    @Override
    public void shouldHaveLeftValue(String value) {
        shouldHaveValue(value);
    }

    @Override
    public void shouldHaveRightValue(String value) {
        shouldHaveValue(sliderElement(1), value);
    }

    private void shouldHaveValue(SelenideElement element, String value) {
        element.shouldHave(Condition.attribute("aria-valuenow", value));
    }

    private SelenideElement sliderElement(int index) {
        return element().$$(".rc-slider-handle").get(index).shouldHave(Condition.exist);
    }
}
