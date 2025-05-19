export interface IRecipeLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function RecipeLayout(props: IRecipeLayoutProps) {
    return (
        <div className="recipe-layout" style={{
         height: '100vh', // Or a specific height
         backgroundColor: '#ffffff',
         margin: '0px 20px'
       }}>
            <div className="recipe-header">
                <h1>{props.title}</h1>
                <h2>{props.subtitle}</h2>
            </div>
            <div className="recipe-content" style={{margin: 'auto', maxWidth: '800px'}}>
                {props.children}
            </div>
        </div>
    )
}