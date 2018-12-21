import homePage from "./pages/home.page";

const defaultOption = "Select city";
const defaultOption2 = "Select users";

describe("Dropdown reference ", () => {
    it("should populate multiple values in a dropdown list", () => {
        homePage.open();
        homePage.dropDownSelector.waitForValue();
        browser.pause(500);
        homePage.dropDownSelector.click();
        homePage.dropDownOptions.waitForValue();
        browser.pause(500);

        const options = homePage.dropDownOptions.value.length;

        expect(options).toBeGreaterThan(1);
    });

    it("should select an option from the drop-down menu", () => {
        homePage.dropDownSelector.waitForExist();
        homePage.clearIndicator.click();
        browser.pause(100);
        expect(homePage.selectPlaceholder).toBe(defaultOption);

        homePage.dropDownSelector.click();
        homePage.dropDownOptions.waitForExist();
        browser.keys("ArrowDown");
        browser.keys("ArrowDown");
        browser.keys("ArrowDown");
        browser.keys("Enter");

        homePage.dropDownSelector.waitForValue();
        expect(homePage.selectedElement.getHTML()).toContain(homePage.selectedValue);
    });

    it("should clear the selected option", () => {
        homePage.open();
        homePage.dropDownSelector.waitForExist();

        browser.pause(1000);
        expect(homePage.selectedElement.getHTML()).toContain(homePage.selectedValue);

        homePage.clearIndicator.click();
        homePage.dropDownSelector.waitForValue();

        expect(homePage.selectPlaceholder).toBe(defaultOption);
    });
});

describe("Dropdown reference set ", () => {
    xit("should select multi options from the drop-down menu", () => {
        homePage.open();
        homePage.dropDownReferenceSet.waitForExist();
        homePage.clearSetIndicator.click();
        expect(homePage.selectSetPlaceholder).toBe(defaultOption2);

        homePage.dropDownReferenceSet.click();
        homePage.dropDownOptions2.waitForExist();
        browser.keys("ArrowDown");
        browser.keys("ArrowDown");
        browser.keys("ArrowDown");
        browser.keys("Enter");

        homePage.dropDownReferenceSet.click();
        homePage.dropDownOptions2.waitForExist();
        browser.keys("ArrowDown");
        browser.keys("ArrowDown");
        browser.keys("Enter");

        homePage.dropDownReferenceSet.waitForValue();
        expect(homePage.selectedSetElement.getHTML()).toContain(homePage.selectedSetValue);
    });

    it("should clear the selected options", () => {
        homePage.open();
        homePage.dropDownReferenceSet.waitForExist();
        browser.pause(1000);

        expect(homePage.selectedSetElement.getHTML()).toContain(homePage.selectedSetValue);

        homePage.clearSetIndicator.click();
        browser.pause(1000);
        homePage.dropDownReferenceSet.waitForValue();

        expect(homePage.selectSetPlaceholder).toBe(defaultOption2);
    });
});
