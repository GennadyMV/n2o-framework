package net.n2oapp.framework.config.io.control;

import net.n2oapp.criteria.filters.FilterType;
import net.n2oapp.framework.api.metadata.ReduxModel;
import net.n2oapp.framework.api.metadata.control.N2oField;
import net.n2oapp.framework.api.metadata.global.dao.N2oPreFilter;
import net.n2oapp.framework.api.metadata.io.IOProcessor;
import net.n2oapp.framework.config.io.toolbar.ToolbarIO;
import org.jdom.Element;

/**
 * Чтение/запись базовых свойств поля
 */
public abstract class FieldIOv2<T extends N2oField> extends ComponentIO<T> implements ControlIOv2 {


    @Override
    public void io(Element e, T m, IOProcessor p) {
        super.io(e, m, p);
        p.attribute(e, "id", m::getId, m::setId);
        p.attributeBoolean(e, "required", m::getRequired, m::setRequired);
        p.attributeBoolean(e, "visible", m::getVisible, m::setVisible);
        p.attributeBoolean(e, "enabled", m::getEnabled, m::setEnabled);
        p.attribute(e, "label", m::getLabel, m::setLabel);
        p.attribute(e, "label-class", m::getLabelClass, m::setLabelClass);
        p.attributeBoolean(e, "no-label", m::getNoLabel, m::setNoLabel);
        p.attribute(e, "description", m::getDescription, m::setDescription);
        p.attribute(e, "domain", m::getDomain, m::setDomain);
        p.attribute(e, "help", m::getHelp, m::setHelp);
        p.child(e, null, "toolbar", m::getToolbar, m::setToolbar, new ToolbarIO());
        p.anyChildren(e, "dependencies", m::getDependencies, m::setDependencies, p.oneOf(N2oField.Dependency.class)
                .add("enabling", N2oField.EnablingDependency.class, this::dependency)
                .add("visibility", N2oField.VisibilityDependency.class, this::visibilityDependency)
                .add("requiring", N2oField.RequiringDependency.class, this::dependency)
                .add("set-value", N2oField.SetValueDependency.class, this::dependency)
                .add("fetch", N2oField.FetchDependency.class, this::dependency)
                .add("reset", N2oField.ResetDependency.class, this::dependency)
                .add("fetch-value", N2oField.FetchValueDependency.class, this::fetchValueDependency));
        p.attributeArray(e, "depends-on", ",", m::getDependsOn, m::setDependsOn);
    }

    private void dependency(Element e, N2oField.Dependency t, IOProcessor p) {
        p.attributeArray(e, "on", ",", t::getOn, t::setOn);
        p.attributeBoolean(e, "apply-on-init", t::getApplyOnInit, t::setApplyOnInit);
        p.text(e, t::getValue, t::setValue);
    }

    private void visibilityDependency(Element e, N2oField.VisibilityDependency t, IOProcessor p) {
        dependency(e, t, p);
        p.attributeBoolean(e, "reset", t::getReset, t::setReset);
    }

    private void fetchValueDependency(Element e, N2oField.FetchValueDependency t, IOProcessor p) {
        dependency(e, t, p);
        p.attribute(e, "query-id", t::getQueryId, t::setQueryId);
        p.attribute(e, "value-field-id", t::getValueFieldId, t::setValueFieldId);
        p.childrenByEnum(e, "pre-filters", t::getPreFilters, t::setPreFilters, N2oPreFilter::getType,
                N2oPreFilter::setType, N2oPreFilter::new, FilterType.class, this::prefilter);
    }

    protected void prefilter(Element e, N2oPreFilter pf, IOProcessor p) {
        p.attribute(e, "field-id", pf::getFieldId, pf::setFieldId);
        p.attribute(e, "value", pf::getValueAttr, pf::setValueAttr);
        p.attribute(e, "values", pf::getValuesAttr, pf::setValuesAttr);
        p.attributeBoolean(e, "required", pf::getRequired, pf::setRequired);
        p.attributeBoolean(e, "reset-on-change", pf::getResetOnChange, pf::setResetOnChange);
        p.attribute(e, "ref-widget-id", pf::getRefWidgetId, pf::setRefWidgetId);
        p.attributeEnum(e, "ref-model", pf::getRefModel, pf::setRefModel, ReduxModel.class);
        p.childrenToStringArray(e, null, "value", pf::getValueList, pf::setValueList);
    }

}
