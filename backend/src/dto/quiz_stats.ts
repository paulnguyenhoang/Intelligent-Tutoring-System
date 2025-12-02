export interface QuizStatsDTO{
    quizID: string,
    totalAttempts: number,
    participants: number,
    averageScore: number,
    highestScore: number,
    lowestScore: number,
    passRate: number
}