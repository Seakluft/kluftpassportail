/**
 * API service for sending form data to n8n webhooks.
 */

const WEBHOOK_INSCRIPTION = 'https://n8n.kluft.ovh/webhook/cbf69025-7075-41d8-b081-297db8f61bc2';
const WEBHOOK_SUPPORT = 'https://n8n.kluft.ovh/webhook/e456cd3d-0f42-406b-b56a-b19d0eb38d81';

/**
 * Submits the registration form to the n8n webhook.
 * @param {Object} data - The registration details.
 * @param {string} data.firstName - Nom / Prénom (can be split or sent as is, let's look at requirements: "Nom et Prénom (Champs texte standards)")
 * @param {string} data.lastName
 * @param {string} data.username - Desired identifier (e.g. "john" which becomes "john@kluft.pass")
 * @param {string} data.service - Chosen service ID or name
 * @returns {Promise<boolean>} Resolves to true if successful, rejects with error otherwise.
 */
export async function submitInscription(data) {
  const response = await fetch(WEBHOOK_INSCRIPTION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      username: `${data.username}@kluft.pass`,
      service: data.service,
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'inscription (${response.status})`);
  }

  return true;
}

/**
 * Submits the support/bug report to the n8n webhook.
 * @param {Object} data - The support ticket details.
 * @param {string} data.username - Kluftpass identifier
 * @param {string} data.issueDescription - Description of the problem
 * @returns {Promise<boolean>} Resolves to true if successful, rejects with error otherwise.
 */
export async function submitSupport(data) {
  const response = await fetch(WEBHOOK_SUPPORT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.username,
      description: data.issueDescription,
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la soumission du ticket (${response.status})`);
  }

  return true;
}
