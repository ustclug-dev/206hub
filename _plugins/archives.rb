module Jekyll
  class Site
    def tags
      @manipulated_tags ||= begin
        hash = Hash.new { |h, k| h[k] = [] }
        collections.each do |name, collection|
          collection.docs.each do |doc|
            doc.data["tags"]&.each { |t| hash[t] << doc }
            doc.data["comments"]&.each do |c|
              c["tags"]&.each { |t| hash[t] << doc }
            end
          end
        end
        hash.each_value { |posts| posts.sort!.reverse!.uniq! }
      end
    end

    def commenters
      @commenters ||= begin
        hash = Hash.new { |h, k| h[k] = [] }
        collections.each do |name, collection|
          collection.docs.each do |doc|
            doc.data["comments"]&.each do |c|
              hash[c["commenter"]] << doc
            end
          end
        end
        hash.each_value { |posts| posts.sort!.reverse!.uniq! }
      end
    end
  end

  module Archives
    class Archives
      def read
        read_tags
        read_categories
        # read_dates
        read_commenters
      end

      # We override #tags because we use original #read_tags
      def tags
        @site.tags
      end

      # We don't override #categories because there're changes here
      def read_categories
        if enabled? "categories"
          @site.collections.each do |title, posts|
            # Note: this is different
            next if title == "posts"
            # Jekyll.logger.warn "COLLECTIONS: title: #{title}, posts: #{posts.docs}"
            @archives << Archive.new(@site, title, "category", posts.docs)
          end
        end
      end

      def read_commenters
        if enabled? "commenters"
          # Jekyll.logger.warn "#{commenters}"
          @site.commenters.each do |title, posts|
            @archives << Archive.new(@site, title, "commenter", posts)
          end
        end
      end
    end
  end
end
