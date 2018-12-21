class HomePage {
    public get dropDownSelector() {
        return browser.element(".mx-name-dropdownReference1");
    }

    public get dropDownOptions() {
        return browser.elements(".mx-name-dropdownReference1 .Select-menu-outer .Select-menu .Select-option");
    }

    public get dropDownOptions2() {
        return browser.elements(".mx-name-dropdownReferenceSet1 .Select-menu-outer .Select-menu .Select-option");
    }

    public get selectPlaceholder() {
        return browser.getText(".mx-name-dropdownReference1 .Select-control .Select-placeholder");
    }

    public get dropDownReferenceSet() {
        return browser.element(".mx-name-dropdownReferenceSet1");
    }

    public get selectedElement() {
        return browser.element(".mx-name-dropdownReference1 .Select-control .Select-value-label");
    }

    public get clearIndicator() {
        return browser.element(".mx-name-dropdownReference1 .Select-clear-zone .Select-clear");
    }

    public get selectedValue() {
        return browser.getText("#react-select-2--value-item");
    }

    public get selectedSetValue() {
        return browser.getText("#react-select-3--value-0").trim();
    }

    public get selectSetPlaceholder() {
        return browser.getText(".mx-name-dropdownReferenceSet2 .Select-control .Select-placeholder");
    }

    public get selectedSetElement() {
        return browser.element(".mx-name-dropdownReferenceSet2 .Select-control .Select-value-label");
    }

    public get clearSetIndicator() {
        return browser.element(".mx-name-dropdownReferenceSet2 .Select-clear-zone .Select-clear");
    }

    public open(): void {
        browser.url("/p/home");
    }
}

const homePage = new HomePage();
export default homePage;
