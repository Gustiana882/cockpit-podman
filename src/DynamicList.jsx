/* SPDX-License-Identifier: LGPL-2.1-or-later */
import React from 'react';

import { Button } from "@patternfly/react-core/dist/esm/components/Button";
import { EmptyState, EmptyStateBody } from "@patternfly/react-core/dist/esm/components/EmptyState";
import { FormFieldGroup, FormFieldGroupHeader } from "@patternfly/react-core/dist/esm/components/Form";
import { HelperText, HelperTextItem } from "@patternfly/react-core/dist/esm/components/HelperText";

import cockpit from 'cockpit';

const _ = cockpit.gettext;

export const DynamicList = ({
    id,
    items,
    label,
    actionLabel,
    emptyStateString,
    formclass,
    default: defaultItem,
    options,
    validationFailed,
    onValidationChange,
    onChange,
    helperText,
    headerActions,
    itemcomponent: ItemComponent,
}) => {
    const additem = () => onChange(list => [...list, { ...defaultItem }]);

    const removeitem = idx => {
        onChange(list => {
            const newItems = [...list];
            delete newItems[idx];
            return newItems;
        });

        const newValidation = validationFailed ? [...validationFailed] : [];
        delete newValidation[idx];
        onValidationChange(newValidation);
    };

    const onItemChange = (idx, field, value) => onChange(list => {
        const newItems = [...list];
        newItems[idx] = { ...newItems[idx], [field]: value || null };
        return newItems;
    });

    return (
        <FormFieldGroup header={
            <FormFieldGroupHeader
                titleText={{ text: label, id: `${id}-title` }}
                actions={<>
                    <Button type="button" variant="secondary" className="btn-add" onClick={additem}>{actionLabel}</Button>
                    {headerActions}
                </>}
            />
        } className={`dynamic-form-group ${formclass || ""}`}>
            {items.some(item => item !== undefined)
                ? <>
                    {items.map((item, idx) => {
                        if (item === undefined)
                            return null;

                        return <ItemComponent
                            key={idx}
                            id={`${id}-${idx}`}
                            item={item}
                            idx={idx}
                            onChange={onItemChange}
                            additem={additem}
                            removeitem={removeitem}
                            options={{ ...options, itemCount: items.length }}
                            validationFailed={validationFailed?.[idx]}
                            onValidationChange={value => {
                                const newValidation = validationFailed ? [...validationFailed] : [];
                                newValidation[idx] = value;
                                if (Object.keys(value).length === 0)
                                    delete newValidation[idx];
                                onValidationChange(newValidation);
                            }}
                        />;
                    })}
                    {helperText &&
                        <HelperText>
                            <HelperTextItem>{helperText}</HelperTextItem>
                        </HelperText>
                    }
                </>
                : <EmptyState><EmptyStateBody>{emptyStateString}</EmptyStateBody></EmptyState>}
        </FormFieldGroup>
    );
};
