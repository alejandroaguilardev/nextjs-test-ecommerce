import { FC } from 'react';
import { Slide } from 'react-slideshow-image';
import styles from './ProductSlidesShow.module.css';
import 'react-slideshow-image/dist/styles.css';

interface Props {
    images: string[]
}

export const ProductSlidesShow: FC<Props> = ({ images }) => {
    return (
        <Slide
            easing='ease'
            duration={700}
            indicators
        >
            {
                images.map(image => {
                    const url = `${image}`;
                    return (
                        <div className={styles['each-slide']} key={image}>
                            <div style={{
                                backgroundImage: `url(${url})`,
                                backgroundSize: 'cover'
                            }} />
                        </div>
                    )
                })
            }

        </Slide>
    )
}
