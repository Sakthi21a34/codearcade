import { useState, useEffect } from 'react';

export const useTypedText = (words, typeSpeed = 100, deleteSpeed = 50, delayBetweenWords = 2000) => {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentWord = words[wordIndex];
            const nextText = isDeleting
                ? currentWord.substring(0, text.length - 1)
                : currentWord.substring(0, text.length + 1);

            setText(nextText);

            if (!isDeleting && nextText === currentWord) {
                setTimeout(() => setIsDeleting(true), delayBetweenWords);
            } else if (isDeleting && nextText === '') {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, delayBetweenWords]);

    return text;
};
