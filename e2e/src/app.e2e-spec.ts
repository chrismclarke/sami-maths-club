import { AppPage } from "./app.po";

describe("new App", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  describe("default screen", () => {
    beforeEach(() => {
      page.navigateTo("/problems");
    });
    it("should have a title saying Problems", () => {
      page.getPageOneTitleText().then(title => {
        expect(title).toEqual("Problems");
      });
    });
  });
});
