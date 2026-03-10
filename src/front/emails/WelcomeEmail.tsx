interface EmailTemplateProps {
    firstName?: string;
}

export default function WelcomeEmail({ firstName = 'Tim 📢' }: EmailTemplateProps) {
    return (
        <div>
            <h1>Bienvenue {firstName} !</h1>
            <p>Merci de t'être inscrit sur Lency.</p>
            <p>Tu peux maintenant découvrir les projets audio/visuel de la communauté, rejoindre une équipe ou poster tes compétences.</p>
            <p>À très bientôt, L'équipe Lency</p>
            <p><small>Si tu n'es pas à l'origine de cette inscription, ignore ce message.</small></p>
        </div>
    );
}

// https://demo.react.email/preview/welcome/netlify-welcome?view=preview&width=1024&height=600