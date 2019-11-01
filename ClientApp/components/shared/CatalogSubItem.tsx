import React from 'react';

interface IProps {
    translate: any;
    href: string;
    src: string;
    title: string;
}

const CatalogSubItem = (props: IProps) => {
    const title = props.translate(props.title);

    return (
        <div 
            className="_1sXEXOyAuGxKeBcoq3FFet" 
            style={{width: '260px', padding: '0px 16px'}}
        >
            <a 
                href={props.href}
                target="_blank" 
                rel="noopener" 
                className="W56bwmOoUEWuw0JBlRz-2 _2aKg0X_H8NWpvhkrUx-RCx GmbHrxVFwcwmq3F1bJOZX"
            >
                <div className="_2lzBIR6ocB6IHyiSQO14y4 _2dZ0q_go7R7wdHwlcrMMCe">
                    <div className="KsKYqtasMRtnJj6_FSCbm _1IeZR-KFbU_ixJO0DOAKpv">
                        <div className="_1IeZR-KFbU_ixJO0DOAKpv">
                            <img 
                                className="_3o3qNO09RZSy4GD3c_VsI8" 
                                crossOrigin="anonymous" 
                                src={props.src} 
                                alt={title} />
                        </div>
                    </div>
                </div>
                <div className="_13_0Qr0UHa9ciVx-UoPbt6">
                    <div className="_2_AI1Qtuteq5eFV-UJKpRD" title={title}>
                        <p 
                            className="_5mwGlnrCD5Xe7VPI_nx_5 W9IR-ZsiAOretU6xTyjoD _1z-JWQqxYHVcouNSwtyQUF _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _2E01o2wzyojtKLJx9bUZGP _1kLjfztPsOUw9W-PSOI9Zu _1gVgCtIuBtlNl2_uDIWl5J" 
                            style={{WebkitLineClamp: 2, maxHeight: 'calc(3.2em)'}}
                        >
                            {title}
                        </p>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default CatalogSubItem;