import { ConnectFishPage } from './app.po';

describe('connect-fish App', () => {
  let page: ConnectFishPage;

  beforeEach(() => {
    page = new ConnectFishPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
