// HomePage Main Container
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES } from '../../config/constants.js';
import { HomeHeroSection } from './HomeHeroSection.js';
import { HomeCurrentSection } from './HomeCurrentSection.js';
import { HomeSuggestedSection } from './HomeSuggestedSection.js';
import { alertService } from '../../services/alertService.js';
import { AlertCard } from '../../components/AlertCard.js';

export const homePage = {
  render: async () => {
    const activeAlerts = await alertService.getActiveAlerts();

    return `
      <div class="wp-home-page page-wrapper">
        ${Navbar.render(ROUTES.HOME)}
        
        ${await HomeHeroSection.render()}

        <main class="container my-4">
          ${activeAlerts.length > 0 ? `
            <div class="mb-4">
              ${AlertCard.render(activeAlerts[0])}
            </div>
          ` : ''}

          ${await HomeCurrentSection.render()}
          ${await HomeSuggestedSection.render()}
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async () => {
    Navbar.afterRender();
    await HomeHeroSection.afterRender();
    await HomeCurrentSection.afterRender();
    await HomeSuggestedSection.afterRender();
  }
};
