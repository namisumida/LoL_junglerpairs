# LoL
# Jungler pairs 

df <- read.csv(file.choose())
summary(df)

# Are champions mentioned in champ1 and champ2 columns?
champ1_list <- unique(df$champ1)
champ2_list <- unique(df$champ2)
champ1_list == champ2_list

# Make datset longer - every champion should be listed in champ1
df_long <- df[1,]
df_long <- rbind(df_long, c(df[1,]$champ2, df[1,]$champ1, df[1,]$win, df[1,]$count))
for (i in 2:nrow(df)) {
  currentRow <- df[i,]
  newRow <- c(currentRow$champ2, currentRow$champ1, currentRow$win, currentRow$count)
  df_long <- rbind(df_long, currentRow, newRow)
}
df_long <- df_long[order(df_long$champ1, df_long$champ2) , ] # sort
View(df_long)

# What's the spread of each champion's average wins? 
champ_df <- as.data.frame(df_long %>% group_by(champ1) %>% 
                            summarise(n_distinctPairs=n(), avg_win=mean(win), min_win=min(win), max_win=max(win), ngames=sum(count), ngames_above50=sum(count>=50)))
summary(champ_df)
View(champ_df)
sample <- subset(df_long, df_long$champ1==1)
View(sample)

# Write long df 
write.csv(df_long, 'jungler_pair_long.csv')