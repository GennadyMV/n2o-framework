package net.n2oapp.framework.autotest.widget.form;

import com.codeborne.selenide.Condition;
import net.n2oapp.framework.autotest.api.component.button.StandardButton;
import net.n2oapp.framework.autotest.api.component.control.InputText;
import net.n2oapp.framework.autotest.api.component.field.StandardField;
import net.n2oapp.framework.autotest.api.component.page.Page;
import net.n2oapp.framework.autotest.api.component.page.SimplePage;
import net.n2oapp.framework.autotest.api.component.widget.FormWidget;
import net.n2oapp.framework.autotest.run.AutoTestBase;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.N2oAllDataPack;
import net.n2oapp.framework.config.metadata.pack.N2oAllPagesPack;
import net.n2oapp.framework.config.metadata.pack.N2oHeaderPack;
import net.n2oapp.framework.config.selective.CompileInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Автотест для виджета Форма
 */
public class FormAT extends AutoTestBase {
    @BeforeAll
    public static void beforeClass() {
        configureSelenide();
    }

    @BeforeEach
    @Override
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oHeaderPack(), new N2oAllPagesPack(), new N2oAllDataPack());
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/blank.header.xml"));
    }

    @Test
    public void testForm() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/widget/form/index.page.xml"),
                new CompileInfo("net/n2oapp/framework/autotest/widget/form/testForm.object.xml"));
        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        page.single().shouldHaveSize(1);
        FormWidget form = page.single().widget(FormWidget.class);
        form.fields().shouldHaveSize(2);

        StandardField surname = form.fields().field("Фамилия");
        surname.labelShouldHave(Condition.text("Фамилия"));
        surname.control(InputText.class).val("test");

        StandardField name = form.fields().field("Имя");
        name.shouldBeRequired();
        name.shouldHaveValidationMessage(Condition.text("Поле обязательно для заполнения"));

        name.control(InputText.class).val("1");
        surname.control(InputText.class).val("test");
        name.shouldHaveValidationMessage(Condition.text("Имя должно быть test"));
        name.control(InputText.class).val("test");
        surname.control(InputText.class).val("test");
        name.shouldHaveValidationMessage(Condition.empty);
    }

    @Test
    public void testToolbar() {
        builder.sources(new CompileInfo("net/n2oapp/framework/autotest/widget/form/toolbar/index.page.xml"));
        SimplePage page = open(SimplePage.class);
        page.shouldExists();

        Page.Tooltip tooltip = page.tooltip();

        FormWidget form = page.single().widget(FormWidget.class);
        form.fields().shouldHaveSize(1);
        InputText name = form.fields().field("Имя").control(InputText.class);

        // проверка, что при разном состоянии доступности кнопок отображаются разные подсказки
        StandardButton button1 = form.toolbar().bottomLeft().button("Кнопка1");
        StandardButton button2 = form.toolbar().bottomLeft().button("Кнопка2");

        // подсказка при недоступности кнопки1 и кнопки2
        button1.shouldBeDisabled();
        button1.hover();
        tooltip.shouldHaveText("Заполните имя");
        button2.shouldBeDisabled();
        button2.hover();
        tooltip.shouldHaveText("Заполните имя");

        name.val("test");
        // подсказка при доступности кнопки1 и кнопки2
        button1.shouldBeEnabled();
        button1.hover();
        tooltip.shouldHaveText("Описание");
        button2.shouldBeEnabled();
        button2.hover();
        // у кнопки2 не должно быть подсказки, т.к. не указан description
        tooltip.shouldNotBeExist();
    }
}
