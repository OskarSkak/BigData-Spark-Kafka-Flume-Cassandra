from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import twitter_samples, stopwords
from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize
from nltk import FreqDist, classify, NaiveBayesClassifier
import nltk

import re, string, random

class SentimentAnalyzer:

    def __init__(self):
        print("Step 1 - Initializing sentiment analyzer...")

        print("Downloading required test data...")
        nltk.download("stopwords");
        nltk.download("twitter_samples")
        nltk.download("punkt")
        nltk.download('wordnet')
        nltk.download('averaged_perceptron_tagger')

        stop_words = stopwords.words("english")

        print("Step 2 - Tokenizing Data")
        positive_tweet_tokens = twitter_samples.tokenized('positive_tweets.json')
        negative_tweet_tokens = twitter_samples.tokenized('negative_tweets.json')

        positive_cleaned_tokens_list = []
        negative_cleaned_tokens_list = []

        print("Step 3/4 - Normalizing and removing noise")
        for tokens in positive_tweet_tokens:
            positive_cleaned_tokens_list.append(self.remove_noise(tokens, stop_words))

        for tokens in negative_tweet_tokens:
            negative_cleaned_tokens_list.append(self.remove_noise(tokens, stop_words))

        print("Step 5 - Determining word density")
        all_pos_words = self.get_all_words(positive_cleaned_tokens_list)
        freq_dist_pos = FreqDist(all_pos_words)

        positive_tokens_for_model = self.get_tweets_for_model(positive_cleaned_tokens_list)
        negative_tokens_for_model = self.get_tweets_for_model(negative_cleaned_tokens_list)

        print("Step 6 - Preparing training data")
        positive_dataset = [(tweet_dict, "Positive")
                            for tweet_dict in positive_tokens_for_model]

        negative_dataset = [(tweet_dict, "Negative")
                            for tweet_dict in negative_tokens_for_model]

        dataset = positive_dataset + negative_dataset
        random.shuffle(dataset)

        train_data = dataset[:7000]
        test_data = dataset[7000:]

        print("Step 7 - Train naive bayes classifer")
        self.classifier = NaiveBayesClassifier.train(train_data)

        print("Step 8 - Testing trained model")
        print("Accuracy is:", classify.accuracy(self.classifier, test_data))

        print(self.classifier.show_most_informative_features(10))
        print("Testing Negative Tweet")
        print(self.predict("I ordered just once from TerribleCo, they screwed up, never used the app again.").toString())
        print("Testing Positive Tweet")
        print(self.predict("Congrats #SportStar on your 7th best goal from last season winning goal of the year :) #Baller #Topbin #oneofmanyworldies").toString())
        print("Testing Sarcastic Tweet")
        print(self.predict("Thank you for sending my baggage to CityX and flying me to CityY at the same time. Brilliant service. #thanksGenericAirline").toString())

    def predict(self, tweet):
        custom_tokens = self.remove_noise(word_tokenize(tweet))
        dic = dict([token, True] for token in custom_tokens)

        # Get probabilities
        prob = self.classifier.prob_classify(dic);

        # Extract confidence
        prediction = Prediction(tweet, "None",0,0)

        for label in prob.samples():
            if label == "Negative":
                prediction.negativeConfidence = prob.prob(label);
            else:
                prediction.positiveConfidence = prob.prob(label);

        # Get the prediction
        prediction.prediction = self.classifier.classify(dic);
        return prediction

    def remove_noise(self, tweet_tokens, stop_words=()):

        cleaned_tokens = []

        for token, tag in pos_tag(tweet_tokens):
            token = re.sub('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*\(\),]|' \
                           '(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', token)
            token = re.sub("(@[A-Za-z0-9_]+)", "", token)

            if tag.startswith("NN"):
                pos = 'n'
            elif tag.startswith('VB'):
                pos = 'v'
            else:
                pos = 'a'

            lemmatizer = WordNetLemmatizer()
            token = lemmatizer.lemmatize(token, pos)

            if len(token) > 0 and token not in string.punctuation and token.lower() not in stop_words:
                cleaned_tokens.append(token.lower())
        return cleaned_tokens

    def get_all_words(self, cleaned_tokens_list):
        for tokens in cleaned_tokens_list:
            for token in tokens:
                yield token

    def get_tweets_for_model(self, cleaned_tokens_list):
        for tweet_tokens in cleaned_tokens_list:
            yield dict([token, True] for token in tweet_tokens)

class Prediction:

    def __init__(self,tweet, prediction, positiveConfidence, negativeConfidence):
        self.tweet = tweet;
        self.prediction = prediction;
        self.positiveConfidence = positiveConfidence;
        self.negativeConfidence = negativeConfidence;

    def toString(self):
        stringBuilder = "Tweet: " + str(self.tweet) + " - Sentiment: " + str(self.prediction) + " - Confidence: Positive/Negative " + str(self.positiveConfidence) + "/" + str(self.negativeConfidence)
        return stringBuilder;
