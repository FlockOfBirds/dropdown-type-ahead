
type MxObject = mendix.lib.MxObject;

import { AttributeType } from "./ContainerUtils";
export interface FetchDataOptions {
    source: "xpath" | "microflow" | "nanoflow";
    entity: string;
    guid: string;
    constraint?: string;
    sortAttributes: AttributeType[];
    attributes?: string[];
    microflow?: string;
    nanoflow?: mx.Nanoflow;
    mxform?: mxui.lib.form._FormBase;
}

export interface FetchByXPathOptions {
    guid: string;
    entity: string;
    constraint: string;
    sortAttributes: AttributeType[];
    attributes?: string[];
    references?: any;
}

export interface ReferencesSpec {
    attributes?: string[];
    amount?: number;
    sort?: string[];
    references?: {
        [ index: string ]: ReferencesSpec;
    };
}

export interface FetchedData {
    mxObjects?: MxObject[];
}

const addPathReference = (references: ReferencesSpec, path: string): ReferencesSpec =>
    path.split("/").reduce((referenceSet, part, index, pathParts) => {
        let parent = referenceSet;
        // Use relations, skip entities sample: "module.relation_X_Y/module.entity_Y/attribute"
        // At the moment Mendix support only 1 level deep.
        if (index % 2 === 0) {
            for (let i = 0; i < index; i += 2) {
                if (parent.references) {
                    parent = parent.references[pathParts[i]];
                }
            }
            if (pathParts.length - 1 === index) {
                // Skip empty attributes
                if (part) {
                    parent.attributes = parent.attributes ? parent.attributes.concat(part) : [ part ];
                }
            } else if (!parent.references) {
                parent.references = { [part]: {} };
            } else if (!parent.references[part]) {
                parent.references[part] = {};
            }
        }

        return referenceSet;
    }, references);

export const fetchData = (options: FetchDataOptions): Promise<MxObject[]> =>
    new Promise<MxObject[]>((resolve, reject) => {
        const { guid, entity, sortAttributes } = options;
        if (entity && guid) {
            if (options.source === "xpath") {
                const references = getReferences(options.attributes || []);
                fetchByXPath({
                    attributes: references.attributes,
                    constraint: options.constraint || "",
                    entity,
                    guid,
                    references: references.references,
                    sortAttributes
                })
                    .then(mxObjects => resolve(mxObjects))
                    .catch(message => reject({ message }));
            } else if (options.source === "microflow" && options.microflow) {
                fetchByMicroflow(options.microflow, guid)
                    .then(mxObjects => resolve(mxObjects))
                    .catch(message => reject({ message }));
            } else if (options.source === "nanoflow" && options.nanoflow && options.mxform) {
                fetchByNanoflow(options.nanoflow, options.mxform)
                    .then(mxObjects => resolve(mxObjects))
                    .catch(message => reject({ message }));
            } else {
                reject("entity & guid are required");
            }
        }
    });

export const fetchByXPath = (options: FetchByXPathOptions): Promise<MxObject[]> => new Promise<MxObject[]>((resolve, reject) => {
    const { guid, entity, constraint, sortAttributes, attributes, references } = options;

    const entityPath = entity.split("/");
    const entityName = entityPath.length > 1 ? entityPath[entityPath.length - 1] : entity;
    const xpath = `//${entityName}${constraint.split("[%CurrentObject%]").join(guid)}`;

    window.mx.data.get({
        xpath,
        callback: resolve,
        error: error => {
            const detail = error.message ? `: ${error.message}` : "";
            reject(`An error occurred while retrieving data via XPath (${xpath})${detail}`);
        },
        filter: {
            attributes,
            offset: 0,
            references,
            sort: createSortProps(sortAttributes)
        }
    });
});

export const createSortProps = (sortAttributes: AttributeType[] | any) => {
    return sortAttributes.map((optionObject: AttributeType) => [ optionObject.name, optionObject.sort ]);
};

export const fetchByMicroflow = (actionname: string, guid: string): Promise<MxObject[]> =>
    new Promise((resolve, reject) => {
        window.mx.ui.action(actionname, {
            callback: result => resolve(result as MxObject[]),
            error: error => {
                const detail = error.message ? `: ${error.message}` : "";
                reject(`An error occurred while retrieving data by microflow (${actionname})${detail}`);
            },
            params: { applyto: "selection", guids: [ guid ] }
        });
    });

export const fetchByNanoflow = (actionname: mx.Nanoflow, mxform: mxui.lib.form._FormBase): Promise<MxObject[]> =>
    new Promise((resolve, reject) => {
        const context = new mendix.lib.MxContext();
        window.mx.data.callNanoflow({
            callback: result => resolve(result as MxObject[]),
            context,
            error: error => {
                const detail = error.message ? `: ${error.message}` : "";
                reject(`An error occurred while retrieving data by nanoflow${detail}`);
            },
            nanoflow: actionname,
            origin: mxform
        });
    });

const getReferences = (attributePaths: string[]): ReferencesSpec => {
    let references: ReferencesSpec = { attributes: [] };
    attributePaths.forEach(attribute => {
        references = addPathReference(references, attribute);
    });

    return references;
};
