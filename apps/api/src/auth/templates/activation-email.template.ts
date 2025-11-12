export interface ActivationEmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const activationEmailTemplate = (
  pathLink: string,
  queryLink: string
): ActivationEmailTemplate => {
  return {
    subject: 'Bienvenue sur SAINA - Activez votre compte',
    text: `Bienvenue sur SAINA ! Activez votre compte en cliquant sur le lien suivant : ${queryLink}`,
    html: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" width="480" style="background-color: #ffffff; border-radius: 8px; padding: 32px; text-align: left; color: #1f2933;">
              <tr>
                <td style="font-size: 20px; font-weight: bold; padding-bottom: 16px;">Bienvenue sur SAINA</td>
              </tr>
              <tr>
                <td style="font-size: 16px; line-height: 1.5; padding-bottom: 24px;">
                  Merci de vous être inscrit. Pour finaliser la création de votre compte, cliquez sur le bouton ci-dessous :
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <a href="${pathLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
                    Activer mon compte
                  </a>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; line-height: 1.5; color: #4b5563;">
                  Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br />
                  <a href="${queryLink}" style="color: #2563eb;">${queryLink}</a>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; line-height: 1.5; color: #6b7280; padding-top: 24px;">
                  À très vite,<br />
                  L'équipe SAINA
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  };
};
